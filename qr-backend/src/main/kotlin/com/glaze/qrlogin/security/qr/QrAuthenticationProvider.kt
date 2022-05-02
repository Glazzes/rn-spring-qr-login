package com.glaze.qrlogin.security.qr

import com.glaze.qrlogin.exception.QrRequestNotFoundException
import com.glaze.qrlogin.objects.QrCodeLoginRequest
import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.security.shared.RedisUserDetailsService
import com.glaze.qrlogin.security.shared.SuccessfulAuthenticationToken
import com.glaze.qrlogin.security.shared.UserToUserDetailsAdapter
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component

@Component
class QrAuthenticationProvider(
    private val qrCodeRepository: QrCodeRepository,
    private val userDetailsService: RedisUserDetailsService,
): AuthenticationProvider {

    override fun authenticate(authentication: Authentication): Authentication {
        val (issuedFor, mobileId, deviceId) = authentication.principal as QrCodeLoginRequest
        val exists = qrCodeRepository.existsByIssuedForAndMobileIdAndDeviceId(issuedFor, mobileId, deviceId)

        if(!exists) {
            throw QrRequestNotFoundException("There was not a qr code registered with these credentials")
        }

        val principal = userDetailsService.loadUserByUsername(issuedFor) as UserToUserDetailsAdapter
        val successfulAuthentication= SuccessfulAuthenticationToken(principal)
        successfulAuthentication.isAuthenticated = true

        return successfulAuthentication
    }

    override fun supports(authentication: Class<*>): Boolean {
        return authentication == QrAuthenticationToken::class
    }
}