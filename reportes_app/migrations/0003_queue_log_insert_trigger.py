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
from __future__ import unicode_literals

from django.db import migrations, connection


def borrar_trigger(apps, schema_editor):
    cursor = connection.cursor()
    sql = "DROP TRIGGER IF EXISTS trigger_queue_log ON queue_log"
    cursor.execute(sql)
    cursor = connection.cursor()
    sql = "DROP FUNCTION IF EXISTS insert_queue_log_ominicontacto_queue_log()"
    cursor.execute(sql)


class Migration(migrations.Migration):

    dependencies = [
        ('reportes_app', '0002_create_queue_log_asterisk'),
    ]

    operations = [
        migrations.RunPython(borrar_trigger, borrar_trigger),
    ]
