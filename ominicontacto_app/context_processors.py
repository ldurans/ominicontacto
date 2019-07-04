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

from __future__ import unicode_literals


from constance import config


def admin_supervisor(request):
    es_supervisor_o_admin = request.user.is_authenticated()
    if es_supervisor_o_admin:
        es_supervisor_o_admin &= request.user.get_is_administrador() or request.user.is_supervisor
    if es_supervisor_o_admin:
        return {
            'WEBPHONE_CLIENT_ENABLED': config.WEBPHONE_CLIENT_ENABLED,
        }
    return {}
