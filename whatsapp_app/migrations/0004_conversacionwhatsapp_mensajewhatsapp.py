# Generated by Django 2.2.7 on 2023-09-14 15:17

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ominicontacto_app', '0102_campana_add_whatsapp_habilitado'),
        ('whatsapp_app', '0003_create_configuracion_whatsapp_campana'),
    ]

    operations = [
        migrations.CreateModel(
            name='ConversacionWhatsapp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('conversation_id', models.CharField(max_length=100)),
                ('destination', models.CharField(max_length=100)),
                ('conversation_type', models.CharField(max_length=100)),
                ('is_active', models.BooleanField(default=True)),
                ('expire', models.BigIntegerField()),
                ('agent', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversaciones', to='ominicontacto_app.AgenteProfile')),
                ('campana', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversaciones', to='ominicontacto_app.Campana')),
                ('client', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conversaciones', to='ominicontacto_app.Contacto')),
            ],
        ),
        migrations.CreateModel(
            name='MensajeWhatsapp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.BigIntegerField()),
                ('origen', models.CharField(max_length=100)),
                ('sender', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('content', django.contrib.postgres.fields.jsonb.JSONField(default=dict)),
                ('type', models.CharField(max_length=100)),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mensajes', to='whatsapp_app.ConversacionWhatsapp')),
            ],
        ),
    ]
