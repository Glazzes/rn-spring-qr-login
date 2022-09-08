package com.glaze.qrlogin.controller

import com.glaze.qrlogin.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1")
class AuthController(private val authService: AuthService){

    /*
    Spring security used to not complain of "hidden" endpoints, this one is for spring security
    not to return a 404 status code, as changing it manually has no effect on the response
     */

    @CrossOrigin("http://localhost:19006")
    @PostMapping(value =  ["/login/qr", "/auth/login"])
    fun login() = ResponseEntity.status(HttpStatus.NO_CONTENT)
        .build<Unit>()

}