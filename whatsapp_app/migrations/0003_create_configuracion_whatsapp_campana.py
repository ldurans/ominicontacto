# Generated by Django 2.2.7 on 2023-01-16 19:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ominicontacto_app', '0101_campana_add_whatsapp_habilitado'),
        ('whatsapp_app', '0002_remove_plantillamensaje_linea'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grupoplantillamensaje',
            name='plantillas',
            field=models.ManyToManyField(to='whatsapp_app.PlantillaMensaje'),
        ),
        migrations.CreateModel(
            name='ConfiguracionWhatsappCampana',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('nivel_servicio', models.IntegerField()),
                ('campana', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='configuracionwhatsapp', to='ominicontacto_app.Campana')),
                ('created_by', models.ForeignKey(default='', on_delete=django.db.models.deletion.PROTECT, related_name='ConfiguracionWhatsappCampana_created', to=settings.AUTH_USER_MODEL)),
                ('grupo_plantilla_whatsapp', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='configuracionwhatsapp', to='whatsapp_app.GrupoPlantillaMensaje')),
                ('grupo_template_whatsapp', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='configuracionwhatsapp', to='whatsapp_app.GrupoTemplateWhatsapp')),
                ('linea', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='configuracionwhatsapp', to='whatsapp_app.Linea')),
                ('updated_by', models.ForeignKey(default='', on_delete=django.db.models.deletion.PROTECT, related_name='ConfiguracionWhatsappCampana_updated', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
