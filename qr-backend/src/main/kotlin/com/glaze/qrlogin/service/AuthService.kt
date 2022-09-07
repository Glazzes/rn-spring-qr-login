package com.glaze.qrlogin.service

import com.glaze.qrlogin.entities.QrCode
import com.glaze.qrlogin.objects.CreateQrCodeRequest
import com.glaze.qrlogin.objects.QrCodeLoginRequest
import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.stereotype.Service

@Service
class AuthService(private val qrCodeRepository: QrCodeRepository){

    fun saveRequest(createQrRequest: QrCodeLoginRequest) {
        val authenticatedUser = SecurityUtil.getAuthenticatedUser()
        val qrCodeRequest = QrCode(
            issuedFor = authenticatedUser.username,
            mobileId = createQrRequest.mobileId,
            deviceId = createQrRequest.mobileId,
            deviceName = createQrRequest.deviceName,
            os = createQrRequest.os,
            location = createQrRequest.location,
            ipAddress = createQrRequest.ipAddress
        )

        qrCodeRepository.save(qrCodeRequest)
    }

}