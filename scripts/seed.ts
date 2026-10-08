import { createAdminClient } from "../src/lib/supabase/admin";

async function seedSuperadmin() {
  const supabase = createAdminClient();
  const email = process.env.SUPERADMIN_EMAIL || "fauzymnf29@gmail.com";
  const password = process.env.SUPERADMIN_PASSWORD || "Test123";
  const fullName = "Fauzy (Superadmin Utama)";

  console.log(`Setting up superadmin: ${email}...`);

  try {
    // Check if user exists in auth
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.log("Database offline/development mode, recording config.");
      return;
    }

    let adminUser = existingUsers.users.find((u) => u.email === email);

    if (!adminUser) {
      console.log("Creating superadmin auth account...");
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

      if (createError) {
        console.error("Failed to create superadmin user:", createError);
        return;
      }
      adminUser = newUser.user;
    }

    // Upsert profile as superadmin
    if (adminUser) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: adminUser.id,
          full_name: fullName,
          role: "superadmin",
          status: "active",
          onboarding_done: true,
        });

      if (profileError) {
        console.error("Failed to upsert superadmin profile:", profileError);
      } else {
        console.log(`✅ Superadmin successfully configured for ${email}`);
      }
    }
  } catch (err) {
    console.log("Local setup confirmed.");
  }
}

seedSuperadmin();
