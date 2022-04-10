package com.glaze.qrlogin.repositories

import com.glaze.qrlogin.entities.QrCode
import org.springframework.data.repository.CrudRepository

interface QrCodeRepository : CrudRepository<QrCode, String> {
    fun findByIssuedForAndMobileIdAndDeviceId(issuedFor: String, mobileId: String, deviceId: String): QrCode?
}