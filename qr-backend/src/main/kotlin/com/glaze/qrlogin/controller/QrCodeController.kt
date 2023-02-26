package com.glaze.qrlogin.controller

import com.glaze.qrlogin.dtos.request.QrCodeLoginRequest
import com.glaze.qrlogin.service.QrCodeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/qrcode")
class QrCodeController(
    private val qrCodeService: QrCodeService
){

    @PostMapping
    fun save(@RequestBody request: QrCodeLoginRequest): ResponseEntity<Unit> {
        qrCodeService.save(request)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

}
