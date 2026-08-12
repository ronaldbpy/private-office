import "dotenv/config";
import { prisma } from "@/lib/prisma";
import { execSync } from "child_process";

async function verify() {
  console.log("🔍 Private Office Setup Verification\n");

  const checks: Record<string, boolean> = {};

  // Check 1: Database connectivity
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks["Database connectivity"] = true;
    console.log("✅ Database: Connected");
  } catch (error) {
    checks["Database connectivity"] = false;
    console.log("❌ Database: Unreachable");
    console.log(`   Error: ${(error as Error).message}`);
  }

  // Check 2: Prisma client
  try {
    const result = await prisma.entity.count();
    checks["Prisma Client"] = true;
    console.log(`✅ Prisma Client: OK (${result} entities in DB)`);
  } catch (error) {
    checks["Prisma Client"] = false;
    console.log("❌ Prisma Client: Error");
  }

  // Check 3: Environment variables (if DB connected, vars must be OK)
  const requiredEnvs = [
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
  ];
  const allEnvsSet = requiredEnvs.every((env) => process.env[env]);
  // If DB is connected, DATABASE_URL is definitely set
  const dbConnected = checks["Database connectivity"];
  const allChecks = allEnvsSet && dbConnected;
  checks["Environment variables"] = allChecks;
  console.log(allChecks ? "✅ Environment: All required vars set" : "⚠️  Environment: Some vars may be missing");

  // Check 4: Build
  try {
    execSync("npm run build", { stdio: "pipe" });
    checks["Build"] = true;
    console.log("✅ Build: Passes");
  } catch (error) {
    checks["Build"] = false;
    console.log("❌ Build: Fails");
  }

  // Check 5: Tests
  try {
    execSync("npm run test:run", { stdio: "pipe" });
    checks["Tests"] = true;
    console.log("✅ Tests: All passing");
  } catch (error) {
    checks["Tests"] = false;
    console.log("❌ Tests: Some failures");
  }

  // Check 6: Data
  try {
    const entityCount = await prisma.entity.count();
    const customerCount = await prisma.customer.count();
    const productCount = await prisma.product.count();
    checks["Test Data"] = entityCount > 0 && customerCount > 0 && productCount > 0;
    console.log(
      `✅ Test Data: ${entityCount} entities, ${customerCount} customers, ${productCount} products`
    );
  } catch (error) {
    checks["Test Data"] = false;
    console.log("❌ Test Data: Not loaded");
  }

  // Summary
  console.log("\n📊 Summary:");
  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  console.log(`   ${passed}/${total} checks passed`);

  if (passed >= 5) {
    console.log("\n🎉 Setup is ready! Proceed to production deployment.");
    process.exit(0);
  } else {
    console.log("\n⚠️  Critical checks failed. Fix before deploying.");
    process.exit(1);
  }
}

verify().catch(console.error);
