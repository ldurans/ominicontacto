# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-06-08 18:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0110_sitioexterno_oculto'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserApiCrm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('usuario', models.CharField(max_length=64)),
                ('password', models.CharField(max_length=128)),
            ],
        ),
    ]
