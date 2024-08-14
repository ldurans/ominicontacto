# Generated by Django 3.2.19 on 2024-08-02 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0104_django_upgrades_compatibility'),
    ]

    operations = [
        migrations.AlterField(
            model_name='queue',
            name='strategy',
            field=models.CharField(
                choices=[('rrordered', 'Rrordered'), ('leastrecent', 'Leastrecent'),
                         ('fewestcalls', 'Fewestcalls'), ('random', 'Random'),
                         ('rrmemory', 'Rremory'), ('ringall', 'Ringall')],
                max_length=128, verbose_name='Estrategia de distribucion'),
        ),
    ]
