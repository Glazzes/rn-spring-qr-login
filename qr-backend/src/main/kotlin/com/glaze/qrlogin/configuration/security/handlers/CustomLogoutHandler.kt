package com.glaze.qrlogin.configuration.security.handlers

import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import com.glaze.qrlogin.utils.JwtUtil
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.core.Authentication
import org.springframework.security.web.authentication.logout.LogoutHandler
import java.time.temporal.ChronoUnit

class CustomLogoutHandler : LogoutHandler {
    override fun logout(request: HttpServletRequest, response: HttpServletResponse, authentication: Authentication) {
        val principal = (authentication.principal) as UserToUserDetailsAdapter
        val expiredToken = JwtUtil.createToken(principal.user.email, 0L, ChronoUnit.SECONDS)

        response.addHeader("Authorization", "Bearer $expiredToken")
        response.addHeader("Refresh-Token", expiredToken)
        response.addHeader("Access-Control-Expose-Headers", "Authorization, RefreshToken")
    }
}
