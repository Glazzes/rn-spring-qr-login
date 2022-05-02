package com.glaze.qrlogin.exception

import javax.naming.AuthenticationException

class QrRequestNotFoundException(message: String): AuthenticationException(message)