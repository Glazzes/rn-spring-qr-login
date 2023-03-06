package com.glaze.qrlogin.service

import com.glaze.qrlogin.entities.QrCode
import com.glaze.qrlogin.dtos.request.QrCodeLoginRequest
import com.glaze.qrlogin.dtos.response.TokenResponseDTO
import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.utils.JwtUtil
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.stereotype.Service
import java.time.temporal.ChronoUnit

@Service
class AuthService(private val qrCodeRepository: QrCodeRepository){

    fun saveRequest(createQrRequest: QrCodeLoginRequest) {
        val authenticatedUser = SecurityUtil.getAuthenticatedUser()
        val qrCodeRequest = QrCode(
            issuedFor = authenticatedUser.username,
            mobileId = createQrRequest.mobileId,
            deviceId = createQrRequest.deviceId,
            deviceName = createQrRequest.deviceName,
            os = createQrRequest.os,
            location = createQrRequest.location,
            ipAddress = createQrRequest.ipAddress
        )

        qrCodeRepository.save(qrCodeRequest)
    }

    fun getTokenPair(token: String): TokenResponseDTO {
        val email = JwtUtil.getSubjectFromToken(token)
        val accessToken = JwtUtil.createToken(email, 15L, ChronoUnit.MINUTES)
        val refreshToken = JwtUtil.createToken(email, 7L, ChronoUnit.DAYS)
        return TokenResponseDTO(accessToken, refreshToken)
    }

}
