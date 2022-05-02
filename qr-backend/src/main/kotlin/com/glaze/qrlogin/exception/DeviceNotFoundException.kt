package com.glaze.qrlogin.exception

import javax.naming.AuthenticationException

class DeviceNotFoundException(message: String): AuthenticationException(message)