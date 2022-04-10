package com.glaze.qrlogin.controller

import com.glaze.qrlogin.objects.QrCodeRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/qrcode")
class QrCodeController {

    @PostMapping
    fun save(@RequestBody request: QrCodeRequest): ResponseEntity<Unit> {
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

}