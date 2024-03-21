# -*- coding: utf-8 -*-
# Copyright (C) 2018 Freetech Solutions

# This file is part of OMniLeads

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License version 3, as published by
# the Free Software Foundation.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.

# You should have received a copy of the GNU Lesser General Public License
# along with this program.  If not, see http://www.gnu.org/licenses/.
#

from django.db import models
from .mixins import AuditableModelMixin
from django.utils.translation import ugettext_lazy as _
from django.db.models import JSONField
from ominicontacto_app.models import (
    AgenteProfile, Campana, Contacto, HistoricalCalificacionCliente)

from django.utils import timezone


class ConfiguracionProveedor(AuditableModelMixin, models.Model):
    TIPO_TWILIO = 0
    TIPO_META = 1
    TIPO_GUPSHUP = 2
    PROVEEDOR_TIPOS = (
        (TIPO_TWILIO, _('Twilio')),
        (TIPO_META, _('Meta')),
        (TIPO_GUPSHUP, _('GupShup'))
    )
    nombre = models.CharField(max_length=100)
    tipo_proveedor = models.IntegerField(choices=PROVEEDOR_TIPOS)
    configuracion = JSONField(default=dict)  # gupshup: Apikey


class LineaManager(models.Manager):

    def get_queryset(self):
        return super(LineaManager, self).get_queryset().exclude(
            is_active=False)


class Linea(AuditableModelMixin):
    objects = LineaManager()
    objects_default = models.Manager()

    nombre = models.CharField(max_length=100)  # appname requerido y unico
    proveedor = models.ForeignKey(
        ConfiguracionProveedor, on_delete=models.CASCADE, related_name="lineas")
    numero = models.CharField(max_length=100)  # sender
    configuracion = JSONField(default=dict)  # appname, appid
    # TODO: Modelar en destino entrante whatsapp?
    destino = models.ForeignKey(
        'configuracion_telefonia_app.DestinoEntrante', on_delete=models.CASCADE,
        related_name="lineas", blank=True, null=True)
    horario = models.ForeignKey(
        'configuracion_telefonia_app.GrupoHorario', on_delete=models.CASCADE,
        related_name="lineas", blank=True, null=True)
    mensaje_bienvenida = models.ForeignKey(
        "PlantillaMensaje", blank=True, null=True,
        on_delete=models.CASCADE, related_name="linea_mensaje_bienvenida")
    mensaje_despedida = models.ForeignKey(
        "PlantillaMensaje", blank=True, null=True,
        on_delete=models.CASCADE, related_name="linea_mensaje_despedida")
    mensaje_fueradehora = models.ForeignKey(
        "PlantillaMensaje", blank=True, null=True,
        on_delete=models.CASCADE, related_name="linea_mensaje_fueradehora")

    def __str__(self) -> str:
        return f"Linea: {self.nombre}"


class PlantillaMensaje(AuditableModelMixin):
    TIPO_TEXT = 0
    TIPO_IMAGE = 1
    MENSAJE_TIPOS = (
        (TIPO_TEXT, _('Texto')),
        (TIPO_IMAGE, _('Imagen')),
    )
    nombre = models.CharField(max_length=100)
    tipo = models.IntegerField(choices=MENSAJE_TIPOS)
    configuracion = JSONField(default=dict)


class TemplateWhatsapp(models.Model):
    linea = models.ForeignKey(
        Linea, on_delete=models.CASCADE, related_name="templates_whatsapp")
    nombre = models.CharField(max_length=100)
    identificador = models.CharField(max_length=100)  # id gupshup
    texto = models.TextField(blank=True, null=True)
    idioma = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    creado = models.CharField(max_length=100)
    modificado = models.CharField(max_length=100)
    tipo = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['linea_id', 'identificador'], name='identificador_unico')
        ]


class GrupoPlantillaMensaje(AuditableModelMixin):
    nombre = models.CharField(max_length=100)
    plantillas = models.ManyToManyField(PlantillaMensaje)

    def __str__(self):
        return f"Grupo Plantilla: {self.nombre}"


class ConfiguracionWhatsappCampana(AuditableModelMixin):
    campana = models.ForeignKey(
        Campana, related_name="configuracionwhatsapp", on_delete=models.CASCADE)
    linea = models.ForeignKey(Linea, related_name="configuracionwhatsapp",
                              on_delete=models.CASCADE, blank=True, null=True)
    grupo_plantilla_whatsapp = models.ForeignKey(
        GrupoPlantillaMensaje, related_name="configuracionwhatsapp",
        blank=True, null=True, on_delete=models.PROTECT)
    nivel_servicio = models.IntegerField()


class MensajeWhatsappManager(models.Manager):
    def mensajes_enviados(self):
        return self.filter(origen=models.F("conversation__line__numero"))

    def mensajes_recibidos(self):
        return self.filter(origen=models.F("conversation__destination"))


class MensajeWhatsapp(models.Model):
    message_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(default=timezone.now)
    origen = models.CharField(max_length=100)
    sender = JSONField(default=dict)
    conversation = models.ForeignKey(
        'ConversacionWhatsapp', related_name="mensajes", on_delete=models.CASCADE, null=True)
    content = JSONField(default=dict)
    type = models.CharField(max_length=100)
    status = models.CharField(max_length=100)
    objects = MensajeWhatsappManager()


class ConversacionWhatsappQuerySet(models.QuerySet):

    def conversaciones_entrantes(self, start_date_str, end_date_str):
        return self.filter(saliente=False,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_salientes(self, start_date_str, end_date_str):
        return self.filter(saliente=True,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_entrantes_atendidas(self, start_date_str, end_date_str):
        return self.filter(saliente=False, atendida=True, agent__isnull=False,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_entrantes_no_atendidas(self, start_date_str, end_date_str):
        return self.filter(saliente=False, atendida=False, date_last_interaction__date__range=[
            start_date_str, end_date_str]) | self.filter(saliente=False, is_disposition=True,
                                                         agent__isnull=True,
                                                         date_last_interaction__date__range=[
                                                             start_date_str, end_date_str])

    def conversaciones_salientes_atendidas(self, start_date_str, end_date_str):
        return self.filter(saliente=True, atendida=True,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_salientes_no_atendidas(self, start_date_str, end_date_str):
        return self.filter(saliente=True, atendida=False,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_salientes_con_error(self, start_date_str, end_date_str):
        return self.filter(saliente=True, error=True,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_salientes_expiradas(self, start_date_str, end_date_str):
        timestamp = timezone.now().astimezone(timezone.get_current_timezone())
        return self.filter(saliente=True, atendida=False, expire__lte=timestamp,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_entrantes_expiradas_no_atendidas(self, start_date_str, end_date_str):
        timestamp = timezone.now().astimezone(timezone.get_current_timezone())
        return self.filter(saliente=False, atendida=False, expire__lte=timestamp,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_no_calificadas(self, start_date_str, end_date_str):
        return self.filter(atendida=True, is_disposition=False,
                           date_last_interaction__date__range=[start_date_str, end_date_str])

    def conversaciones_en_curso(
            self, start_date_str=None, end_date_str=None):
        timestamp = timezone.now().astimezone(timezone.get_current_timezone())
        if start_date_str and end_date_str:
            return self.filter(
                expire__gte=timestamp, is_disposition=False,
                date_last_interaction__date__range=[start_date_str, end_date_str])
        return self.filter(expire__gte=timestamp, is_disposition=False)

    def numero_mensajes_enviados(self, start_date_str, end_date_str):
        return MensajeWhatsapp.objects.mensajes_enviados().filter(
            conversation__in=self.filter(
                date_last_interaction__date__range=[start_date_str, end_date_str]),
            timestamp__date__range=[start_date_str, end_date_str]).count()

    def numero_mensajes_recibidos(self, start_date_str, end_date_str):
        return MensajeWhatsapp.objects.mensajes_recibidos().filter(
            conversation__in=self.filter(
                date_last_interaction__date__range=[start_date_str, end_date_str]),
            timestamp__date__range=[start_date_str, end_date_str]).count()


class ConversacionWhatsapp(models.Model):
    line = models.ForeignKey(
        Linea, related_name="conversaciones", on_delete=models.CASCADE)
    campana = models.ForeignKey(
        Campana, null=True, related_name="conversaciones", on_delete=models.CASCADE)
    destination = models.CharField(max_length=100)
    whatsapp_id = models.CharField(max_length=100, null=True)
    client = models.ForeignKey(
        Contacto, null=True, related_name="conversaciones", on_delete=models.CASCADE)
    agent = models.ForeignKey(
        AgenteProfile, null=True, related_name="conversaciones", on_delete=models.CASCADE)
    is_active = models.BooleanField(default=False)
    is_disposition = models.BooleanField(default=False)
    conversation_disposition = models.ForeignKey(
        HistoricalCalificacionCliente, related_name="conversaciones",
        null=True, on_delete=models.CASCADE)
    expire = models.DateTimeField(null=True)
    timestamp = models.DateTimeField(default=timezone.now)
    saliente = models.BooleanField(default=False)
    atendida = models.BooleanField(default=False)
    error = models.BooleanField(default=False)
    error_ex = models.JSONField(default=dict)
    date_last_interaction = models.DateTimeField(null=True)
    client_alias = models.CharField(max_length=100, null=True)
    objects = ConversacionWhatsappQuerySet.as_manager()

    def otorgar_conversacion(self, agent):
        try:
            self.agent = agent
            self.save()
            return True
        except Exception:
            return False


class MenuInteractivoWhatsapp(models.Model):
    texto_opciones = models.CharField(max_length=100)
    texto_opcion_incorrecta = models.CharField(max_length=100)
    texto_derivacion = models.CharField(max_length=100)
    timeout = models.IntegerField()

    @property
    def nombre(self):
        return 'menu-interactivo-whatsapp-{0}'.format(self.id)


class OpcionMenuInteractivoWhatsapp(models.Model):
    opcion = models.OneToOneField(
        'configuracion_telefonia_app.OpcionDestino', on_delete=models.CASCADE,
        related_name="opcion_menu_whatsapp")
    descripcion = models.CharField(max_length=100)
