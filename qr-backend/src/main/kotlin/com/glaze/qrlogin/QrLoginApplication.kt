package com.glaze.qrlogin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableAsync
import org.springframework.scheduling.annotation.EnableScheduling

@EnableAsync
@EnableScheduling
@SpringBootApplication
class QrLoginApplication

fun main(args: Array<String>) {
	runApplication<QrLoginApplication>(*args)
}
