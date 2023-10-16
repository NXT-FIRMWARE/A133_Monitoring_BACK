-- CreateTable
CREATE TABLE "Camera" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cameraName" TEXT NOT NULL,
    "rtsp" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "capture_time" INTEGER NOT NULL,
    "http_server" TEXT NOT NULL,
    "ftp_server" TEXT NOT NULL,
    "ftp_username" TEXT NOT NULL,
    "ftp_password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Camera_cameraName_key" ON "Camera"("cameraName");

-- CreateIndex
CREATE UNIQUE INDEX "Camera_ip_key" ON "Camera"("ip");
