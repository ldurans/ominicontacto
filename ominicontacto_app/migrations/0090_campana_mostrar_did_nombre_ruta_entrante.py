# Generated by Django 2.2.7 on 2022-03-11 22:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0089_campana_campo_direccion'),
    ]

    operations = [
        migrations.AddField(
            model_name='campana',
            name='mostrar_did',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='campana',
            name='mostrar_nombre_ruta_entrante',
            field=models.BooleanField(default=False),
        ),
        
    ]
