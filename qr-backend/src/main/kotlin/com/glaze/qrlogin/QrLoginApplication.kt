package com.glaze.qrlogin

import com.glaze.qrlogin.configuration.WebConfigurationProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling

@EnableAsync
@EnableScheduling
@SpringBootApplication
@EnableConfigurationProperties(value = [WebConfigurationProperties::class])
class QrLoginApplication

fun main(args: Array<String>) {
	runApplication<QrLoginApplication>(*args)
}
