package com.glaze.qrlogin.configuration

import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler
import org.springframework.aop.interceptor.SimpleAsyncUncaughtExceptionHandler
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.task.AsyncTaskExecutor
import org.springframework.scheduling.annotation.AsyncConfigurer
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.util.concurrent.Executor
import java.util.concurrent.ThreadPoolExecutor

@Configuration
class AsyncConfiguration : AsyncConfigurer {

    @Bean(name = ["taskExecutor"])
    override fun getAsyncExecutor(): Executor {
        return ThreadPoolTaskExecutor().apply {
            corePoolSize = 10
            maxPoolSize = 20
            queueCapacity = 10
            this.setRejectedExecutionHandler(ThreadPoolExecutor.CallerRunsPolicy())
            this.setThreadNamePrefix("Custom-Thread")
            this.initialize()
        }
    }

    @Bean
    fun webConfigurer(@Qualifier("taskExecutor") taskExecutor: AsyncTaskExecutor): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun configureAsyncSupport(configurer: AsyncSupportConfigurer) {
                configurer.setDefaultTimeout(500000)
                    .setTaskExecutor(taskExecutor)
            }
        }
    }

    override fun getAsyncUncaughtExceptionHandler(): AsyncUncaughtExceptionHandler? {
        return SimpleAsyncUncaughtExceptionHandler()
    }

}
