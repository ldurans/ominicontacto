# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2018-03-19 19:14
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0166_crear_contacto_y_metadata_calificacioncliente'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='calificacionmanual',
            name='metadata',
        ),
        migrations.RemoveField(
            model_name='calificacionmanual',
            name='telefono',
        ),
        migrations.AlterField(
            model_name='calificacionmanual',
            name='contacto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                                    to='ominicontacto_app.Contacto'),
        ),
    ]
