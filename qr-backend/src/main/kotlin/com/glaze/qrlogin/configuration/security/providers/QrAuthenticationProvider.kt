package com.glaze.qrlogin.configuration.security.providers

import com.glaze.qrlogin.exception.QrRequestNotFoundException
import com.glaze.qrlogin.dtos.request.QrCodeLoginRequest
import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.configuration.security.contracts.RedisUserDetailsService
import com.glaze.qrlogin.configuration.security.tokens.SuccessfulAuthenticationToken
import com.glaze.qrlogin.configuration.security.contracts.UserToUserDetailsAdapter
import com.glaze.qrlogin.configuration.security.tokens.QrAuthenticationToken
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.Authentication

class QrAuthenticationProvider(
    private val qrCodeRepository: QrCodeRepository,
    private val userDetailsService: RedisUserDetailsService,
): AuthenticationProvider {

    override fun authenticate(authentication: Authentication): Authentication {
        val request = authentication.principal as QrCodeLoginRequest
        val exists = qrCodeRepository.existsByIssuedForAndMobileIdAndDeviceId(
            request.issuedFor,
            request.mobileId,
            request.deviceId
        )

        if(!exists) {
            throw QrRequestNotFoundException("There was not a qr code registered with these credentials")
        }

        val principal = userDetailsService.loadUserById(request.issuedFor) as UserToUserDetailsAdapter
        val successfulAuthentication = SuccessfulAuthenticationToken(principal)
        successfulAuthentication.isAuthenticated = true

        return successfulAuthentication
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication.isAssignableFrom(QrAuthenticationToken::class.java)
    }
}
