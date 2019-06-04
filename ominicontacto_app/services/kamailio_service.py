# -*- coding: utf-8 -*-
# Copyright (C) 2018 Freetech Solutions

# This file is part of OMniLeads

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see http://www.gnu.org/licenses/.
#

"""
Servicio para generar credenciales SIP efimeras para autenticar usuario en kamailio
"""

from __future__ import unicode_literals

import hmac
import logging
import subprocess
import time

from hashlib import sha1
from django.conf import settings

logger = logging.getLogger(__name__)


class KamailioService():

    def generar_sip_timestamp(self):
        ttl = settings.EPHEMERAL_USER_TTL
        date = time.time()
        return date + ttl

    def generar_sip_user(self, sip_extension, timestamp=None):
        if timestamp is None:
            timestamp = self.generar_sip_timestamp()
        user_ephemeral = str(timestamp).split('.')[0] + ":" + str(sip_extension)
        return user_ephemeral

    def generar_sip_password(self, sip_usuario):
        try:
            # cmd = subprocess.check_output(['ssh', settings.OML_KAMAILIO_HOSTNAME,
            #                              settings.OML_KAMAILIO_CMD])
            secret_key = settings.SIP_SECRET_KEY
            password_hashed = hmac.new(secret_key, sip_usuario, sha1)
            password_ephemeral = password_hashed.digest().encode("base64").rstrip('\n')
            return password_ephemeral
        except subprocess.CalledProcessError as e:
            logger.error('Hubo un problema al obtener la secret_key, verificar el comando {0}'.
                         format(e.cmd))
