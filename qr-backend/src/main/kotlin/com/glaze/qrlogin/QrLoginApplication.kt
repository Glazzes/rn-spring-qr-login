package com.glaze.qrlogin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class QrLoginApplication

fun main(args: Array<String>) {
	runApplication<QrLoginApplication>(*args)
}
