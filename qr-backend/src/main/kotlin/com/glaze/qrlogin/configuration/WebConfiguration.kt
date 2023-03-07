package com.glaze.qrlogin.configuration

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.glaze.qrlogin.dtos.request.SignUpRequest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfiguration {

    private val mapper = jacksonObjectMapper()

    @Bean
    fun stringToSignUpRequestConverter(): Converter<String, SignUpRequest> {
        // Spring fails to execute this bean when expressed as IntelliJ suggests
        return object : Converter<String, SignUpRequest> {
            override fun convert(value: String): SignUpRequest {
                return mapper.readValue(value, SignUpRequest::class.java)
            }
        }
    }

    /*
    @Bean
    fun webMvcConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                    .allowedHeaders("*")
                    .exposedHeaders("*")
                    .allowedOrigins("http://localhost:19006")
                    .maxAge(3600L)
                    .allowCredentials(true)
            }
        }
    }
    */
     */
}
