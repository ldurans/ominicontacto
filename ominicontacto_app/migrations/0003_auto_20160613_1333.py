# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-13 13:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0002_elimina active name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agenteprofile',
            name='sip_extension',
            field=models.CharField(blank=True, max_length=128, null=True, unique=True),
        ),
    ]
