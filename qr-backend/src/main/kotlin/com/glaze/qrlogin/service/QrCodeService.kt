package com.glaze.qrlogin.service

import com.glaze.qrlogin.entities.QrCode
import com.glaze.qrlogin.exception.AssociationException
import com.glaze.qrlogin.dtos.request.QrCodeLoginRequest
import com.glaze.qrlogin.repositories.QrCodeRepository
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.stereotype.Service

@Service
class QrCodeService(
    private val qrCodeRepository: QrCodeRepository
){

    fun save(request: QrCodeLoginRequest): QrCode {
        val authenticatedUser = SecurityUtil.getAuthenticatedUser()
        if(request.issuedFor != authenticatedUser.id) {
            throw AssociationException("You attempted to issue a token for another user")
        }

        println(request.toString())

        val entity = QrCode(
            issuedFor = request.issuedFor,
            mobileId = request.mobileId,
            deviceId = request.deviceId,
            deviceName = request.deviceName,
            os = request.os,
            location = request.location,
            ipAddress = request.ipAddress
        )

        return qrCodeRepository.save(entity)
    }

}
