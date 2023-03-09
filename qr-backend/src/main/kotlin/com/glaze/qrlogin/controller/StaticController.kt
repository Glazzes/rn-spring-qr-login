package com.glaze.qrlogin.controller

import com.glaze.qrlogin.configuration.WebConfigurationProperties
import com.glaze.qrlogin.utils.FileUtil
import org.springframework.http.CacheControl
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import java.util.concurrent.TimeUnit

@RestController
@RequestMapping("/static")
class StaticController (
    private val properties: WebConfigurationProperties
){

    @GetMapping("/{filename}")
    fun getProfilePicture(@PathVariable filename: String): ResponseEntity<StreamingResponseBody>  {
         return ResponseEntity.status(HttpStatus.OK)
             .contentType(MediaType.IMAGE_JPEG)
             .cacheControl(CacheControl.maxAge(2L, TimeUnit.MINUTES))
             .body(FileUtil.findByName(filename, properties.imageStore))
    }

}
