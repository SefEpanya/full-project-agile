import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a4175c66/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== AUTH ROUTES ====================

// Sign up a new user
app.post("/make-server-a4175c66/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user with auto-confirmed email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error signing up user:', error);
      return c.json({ error: error.message }, 400);
    }

    // Sign in the user immediately to get session
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Error signing in after signup:', signInError);
      return c.json({ error: signInError.message }, 400);
    }

    return c.json({ 
      user: data.user,
      session: sessionData.session,
      access_token: sessionData.session?.access_token
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Sign in existing user
app.post("/make-server-a4175c66/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in user:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      user: data.user,
      session: data.session,
      access_token: data.session?.access_token
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'Internal server error during signin' }, 500);
  }
});

// Sign out user
app.post("/make-server-a4175c66/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      console.error('Error signing out user:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Sign out error:', error);
    return c.json({ error: 'Internal server error during signout' }, 500);
  }
});

// Get current user
app.get("/make-server-a4175c66/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.error('Error getting user:', error);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({ error: 'Internal server error getting user' }, 500);
  }
});

// ==================== KANBAN ROUTES ====================

// Create a new Kanban
app.post("/make-server-a4175c66/kanbans", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title } = await c.req.json();

    if (!title) {
      return c.json({ error: 'Title is required' }, 400);
    }

    // Generate unique invite code
    const inviteCode = `KAN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const kanbanId = `kanban-${Date.now()}`;
    const kanbanData = {
      id: kanbanId,
      title,
      inviteCode,
      ownerId: user.id,
      ownerName: user.user_metadata?.name || user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`kanban:${kanbanId}`, kanbanData);
    await kv.set(`invite:${inviteCode}`, kanbanId);
    await kv.set(`user:${user.id}:kanban:${kanbanId}`, { role: 'owner', isAdmin: true });

    // Create demo objective and task
    const demoObjective = {
      id: 'obj-demo-1',
      kanbanId,
      title: 'Finaliser les Partenariats Pour ISJ EVENT\'S',
      description: 'Établir et sécuriser tous les partenariats stratégiques pour l\'événement',
      color: '#3b82f6',
      createdAt: new Date().toISOString(),
    };

    const demoTask = {
      id: 'task-demo-1',
      objectiveId: 'obj-demo-1',
      kanbanId,
      title: 'Contacter les sponsors potentiels',
      description: 'Identifier et contacter 20 sponsors potentiels pour l\'événement',
      checklist: [
        { id: 'check-1', text: 'Créer la liste des sponsors ciblés', completed: false },
        { id: 'check-2', text: 'Préparer le dossier de sponsoring', completed: false },
        { id: 'check-3', text: 'Envoyer les emails de contact', completed: false },
      ],
      resources: {
        material: ['Dossier de sponsoring PDF'],
        human: ['Responsable Partenariats'],
        financial: ['Budget communication: 500€'],
      },
      estimatedHours: 12,
      status: 'tasks',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`objective:${demoObjective.id}`, demoObjective);
    await kv.set(`task:${demoTask.id}`, demoTask);

    return c.json({ kanban: kanbanData });
  } catch (error) {
    console.error('Create kanban error:', error);
    return c.json({ error: 'Internal server error creating kanban' }, 500);
  }
});

// Get a Kanban by ID
app.get("/make-server-a4175c66/kanbans/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const kanbanId = c.req.param('id');
    const kanban = await kv.get(`kanban:${kanbanId}`);

    if (!kanban) {
      return c.json({ error: 'Kanban not found' }, 404);
    }

    // Check if user has access
    const userAccess = await kv.get(`user:${user.id}:kanban:${kanbanId}`);
    if (!userAccess) {
      return c.json({ error: 'Access denied' }, 403);
    }

    // Get all objectives for this kanban
    const allObjectives = await kv.getByPrefix(`objective:`);
    const objectives = allObjectives.filter((obj: any) => obj.kanbanId === kanbanId);

    // Get all tasks for this kanban
    const allTasks = await kv.getByPrefix(`task:`);
    const tasks = allTasks.filter((task: any) => task.kanbanId === kanbanId);

    // Get all team members
    const allMembers = await kv.getByPrefix(`user:`);
    const teamMembers = allMembers
      .filter((member: any) => member.role && member.isAdmin !== undefined)
      .filter((member: any) => {
        const key = Object.keys(member)[0];
        return key && key.includes(`:kanban:${kanbanId}`);
      });

    return c.json({ 
      kanban,
      objectives,
      tasks,
      teamMembers,
      userRole: userAccess
    });
  } catch (error) {
    console.error('Get kanban error:', error);
    return c.json({ error: 'Internal server error getting kanban' }, 500);
  }
});

// Get all kanbans for current user
app.get("/make-server-a4175c66/kanbans", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all kanban access for this user
    const userKanbans = await kv.getByPrefix(`user:${user.id}:kanban:`);
    
    const kanbans = [];
    for (const access of userKanbans) {
      // Extract kanban ID from key pattern "user:{userId}:kanban:{kanbanId}"
      const matches = Object.keys(access)[0]?.match(/kanban:([^:]+)$/);
      if (matches) {
        const kanbanId = matches[1];
        const kanban = await kv.get(`kanban:${kanbanId}`);
        if (kanban) {
          kanbans.push({ ...kanban, userRole: access });
        }
      }
    }

    return c.json({ kanbans });
  } catch (error) {
    console.error('Get kanbans error:', error);
    return c.json({ error: 'Internal server error getting kanbans' }, 500);
  }
});

// Join Kanban via invite code
app.post("/make-server-a4175c66/kanbans/join", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { inviteCode, role } = await c.req.json();

    if (!inviteCode) {
      return c.json({ error: 'Invite code is required' }, 400);
    }

    const kanbanId = await kv.get(`invite:${inviteCode}`);
    if (!kanbanId) {
      return c.json({ error: 'Invalid invite code' }, 404);
    }

    const kanban = await kv.get(`kanban:${kanbanId}`);
    if (!kanban) {
      return c.json({ error: 'Kanban not found' }, 404);
    }

    // Add user to kanban
    await kv.set(`user:${user.id}:kanban:${kanbanId}`, { 
      role: role || 'Membre d\'équipe', 
      isAdmin: false,
      joinedAt: new Date().toISOString()
    });

    return c.json({ kanban, message: 'Successfully joined kanban' });
  } catch (error) {
    console.error('Join kanban error:', error);
    return c.json({ error: 'Internal server error joining kanban' }, 500);
  }
});

// ==================== OBJECTIVE ROUTES ====================

// Create objective
app.post("/make-server-a4175c66/objectives", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const objectiveData = await c.req.json();
    const { kanbanId } = objectiveData;

    // Check if user is admin
    const userAccess = await kv.get(`user:${user.id}:kanban:${kanbanId}`);
    if (!userAccess || !userAccess.isAdmin) {
      return c.json({ error: 'Only admins can create objectives' }, 403);
    }

    const objective = {
      ...objectiveData,
      id: `obj-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`objective:${objective.id}`, objective);

    return c.json({ objective });
  } catch (error) {
    console.error('Create objective error:', error);
    return c.json({ error: 'Internal server error creating objective' }, 500);
  }
});

// ==================== TASK ROUTES ====================

// Create task
app.post("/make-server-a4175c66/tasks", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskData = await c.req.json();
    const { kanbanId } = taskData;

    // Check if user is admin
    const userAccess = await kv.get(`user:${user.id}:kanban:${kanbanId}`);
    if (!userAccess || !userAccess.isAdmin) {
      return c.json({ error: 'Only admins can create tasks' }, 403);
    }

    const task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`task:${task.id}`, task);

    return c.json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    return c.json({ error: 'Internal server error creating task' }, 500);
  }
});

// Update task
app.put("/make-server-a4175c66/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('id');
    const updates = await c.req.json();

    const existingTask = await kv.get(`task:${taskId}`);
    if (!existingTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    // Check if user is admin
    const userAccess = await kv.get(`user:${user.id}:kanban:${existingTask.kanbanId}`);
    if (!userAccess || !userAccess.isAdmin) {
      return c.json({ error: 'Only admins can update tasks' }, 403);
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`task:${taskId}`, updatedTask);

    return c.json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    return c.json({ error: 'Internal server error updating task' }, 500);
  }
});

// Delete task
app.delete("/make-server-a4175c66/tasks/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('id');
    const existingTask = await kv.get(`task:${taskId}`);
    
    if (!existingTask) {
      return c.json({ error: 'Task not found' }, 404);
    }

    // Check if user is admin
    const userAccess = await kv.get(`user:${user.id}:kanban:${existingTask.kanbanId}`);
    if (!userAccess || !userAccess.isAdmin) {
      return c.json({ error: 'Only admins can delete tasks' }, 403);
    }

    await kv.del(`task:${taskId}`);

    return c.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return c.json({ error: 'Internal server error deleting task' }, 500);
  }
});

Deno.serve(app.fetch);