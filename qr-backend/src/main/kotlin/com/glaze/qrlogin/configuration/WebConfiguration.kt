package com.glaze.qrlogin.configuration

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.dtos.request.SignUpRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter

@Configuration
class WebConfiguration {

    private val mapper = jacksonObjectMapper()

    @Bean
    fun stringToSignUpRequestConverter(): Converter<String, SignUpRequest> {
        return object : Converter<String, SignUpRequest> {
            override fun convert(value: String): SignUpRequest {
                return mapper.readValue(value, SignUpRequest::class.java)
            }
        }
    }

}
