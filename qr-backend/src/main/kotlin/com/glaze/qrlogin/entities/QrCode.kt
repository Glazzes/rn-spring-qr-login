package com.glaze.qrlogin.entities

import org.springframework.data.annotation.Id
import org.springframework.data.redis.core.RedisHash
import org.springframework.data.redis.core.index.Indexed

@RedisHash(value = "qr-codes", timeToLive = 300)
class QrCode (
    @Id var id: String? = null,
    @Indexed var issuedFor: String,
    @Indexed var mobileId: String,
    @Indexed var deviceId: String,
    var deviceName: String,
    var os: String,
    var ipAddress: String,
    var location: String,
)
