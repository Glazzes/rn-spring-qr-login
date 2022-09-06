package com.glaze.qrlogin.exception

import org.springframework.security.core.AuthenticationException

class InvalidJwtAuthenticationException(message: String): AuthenticationException(message)