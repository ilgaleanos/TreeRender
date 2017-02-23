package main

import (
	"github.com/gin-gonic/gin"
	"runtime"
)


func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.LoadHTMLGlob("templates/**/*")
	r.Static("/static", "./static")

	r.GET("/", index )
	r.Run(":8080")
}

func index(c *gin.Context)  {
	c.HTML(200, "index.html","")
	return
}

func init() {
	runtime.GOMAXPROCS(runtime.NumCPU())
}
