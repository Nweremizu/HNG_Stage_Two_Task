-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" VARCHAR NOT NULL DEFAULT '',
    "lastName" VARCHAR NOT NULL DEFAULT '',
    "email" VARCHAR NOT NULL DEFAULT '',
    "password" VARCHAR NOT NULL,
    "phone" VARCHAR,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Organization" (
    "orgId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("orgId")
);

-- CreateTable
CREATE TABLE "UserOrganization" (
    "userId" UUID NOT NULL,
    "orgId" UUID NOT NULL,

    CONSTRAINT "UserOrganization_pkey" PRIMARY KEY ("userId","orgId")
);

-- CreateTable
CREATE TABLE "_UserOrganization" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserOrganization_AB_unique" ON "_UserOrganization"("A", "B");

-- CreateIndex
CREATE INDEX "_UserOrganization_B_index" ON "_UserOrganization"("B");

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganization" ADD CONSTRAINT "UserOrganization_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrganization" ADD CONSTRAINT "_UserOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserOrganization" ADD CONSTRAINT "_UserOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
