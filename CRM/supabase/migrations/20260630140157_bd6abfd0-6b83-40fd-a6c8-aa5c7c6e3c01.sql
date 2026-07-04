
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-assign admin role on signup (single-team CRM)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Status / source enums
CREATE TYPE public.lead_status AS ENUM ('new','contacted','converted');
CREATE TYPE public.lead_source AS ENUM ('website','referral','social','email','phone','other');

-- Leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  source lead_source NOT NULL DEFAULT 'website',
  status lead_status NOT NULL DEFAULT 'new',
  notes text,
  follow_up_date date,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update leads" ON public.leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete leads" ON public.leads FOR DELETE TO authenticated USING (true);

CREATE INDEX leads_status_idx ON public.leads(status);
CREATE INDEX leads_source_idx ON public.leads(source);
CREATE INDEX leads_followup_idx ON public.leads(follow_up_date);

-- Lead notes
CREATE TABLE public.lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_notes TO authenticated;
GRANT ALL ON public.lead_notes TO service_role;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can manage notes" ON public.lead_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER leads_touch BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER lead_notes_touch BEFORE UPDATE ON public.lead_notes FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed demo leads
INSERT INTO public.leads (full_name, email, phone, company, source, status, notes, follow_up_date, created_at) VALUES
('Olivia Bennett','olivia.bennett@northwind.io','+1 415 555 0142','Northwind Labs','website','new','Requested pricing for team plan',CURRENT_DATE + 2, now() - interval '1 day'),
('Marcus Chen','m.chen@brightpath.co','+1 212 555 0177','BrightPath','referral','contacted','Demo scheduled Tuesday',CURRENT_DATE + 5, now() - interval '3 days'),
('Priya Raman','priya@helixstudio.com','+44 20 7946 0991','Helix Studio','social','converted','Annual contract signed',NULL, now() - interval '8 days'),
('Diego Alvarez','diego@lumosgrid.com','+34 91 555 2231','Lumos Grid','email','new','Interested in API integration',CURRENT_DATE + 1, now() - interval '6 hours'),
('Sara Whitfield','sara.w@cohostudio.co','+1 503 555 0188','Coho Studio','website','contacted','Following up on proposal',CURRENT_DATE, now() - interval '2 days'),
('Jonas Berg','jonas@nordicstack.se','+46 8 555 0103','Nordic Stack','phone','converted','Onboarded last week',NULL, now() - interval '14 days'),
('Amelia Carter','amelia@verdantapp.com','+1 646 555 0119','Verdant','website','new','Form submission from landing page',CURRENT_DATE + 3, now() - interval '12 hours'),
('Rahul Mehta','rahul@quantleap.in','+91 22 5555 7741','QuantLeap','referral','contacted','Wants enterprise quote',CURRENT_DATE + 4, now() - interval '4 days'),
('Hannah Lee','hannah@orbitlearn.io','+1 312 555 0166','OrbitLearn','social','new','Discovered us via LinkedIn post',CURRENT_DATE + 7, now() - interval '2 days'),
('Tobias Klein','tobias@bauwerk.de','+49 30 5555 0044','Bauwerk','email','contacted','Negotiating contract terms',CURRENT_DATE + 1, now() - interval '5 days'),
('Mei Tanaka','mei@sakurabrew.jp','+81 3 5555 0212','Sakura Brew','website','converted','Renewed for second year',NULL, now() - interval '21 days'),
('Ethan Russo','ethan@parallaxhq.com','+1 718 555 0151','Parallax HQ','referral','new','Wants white-label pricing',CURRENT_DATE + 6, now() - interval '1 day'),
('Zara Okafor','zara@kindredpath.com','+234 1 555 0190','Kindred Path','social','contacted','Booked a sales call',CURRENT_DATE + 2, now() - interval '3 days'),
('Lucas Moreno','lucas@trailpinegear.com','+1 720 555 0177','Trailpine Gear','website','new','Asked about Shopify integration',CURRENT_DATE + 4, now() - interval '8 hours'),
('Isabelle Dupont','isabelle@maisoncode.fr','+33 1 5555 0066','Maison Code','email','converted','Closed - mid-tier plan',NULL, now() - interval '10 days'),
('Noah Patel','noah@bluebirdfintech.com','+1 415 555 0144','Bluebird','phone','contacted','Reviewing security questionnaire',CURRENT_DATE + 3, now() - interval '6 days'),
('Eva Lindqvist','eva@aurorasignal.com','+46 8 555 0166','Aurora Signal','website','new','Trial signup yesterday',CURRENT_DATE + 5, now() - interval '20 hours'),
('Samuel Ortiz','sam@granitecollective.com','+1 213 555 0122','Granite Collective','referral','converted','Multi-seat purchase',NULL, now() - interval '30 days'),
('Camille Roux','camille@petaldesign.co','+33 4 5555 0011','Petal Design','social','new','Interested in agency tier',CURRENT_DATE + 2, now() - interval '4 hours'),
('Yuki Watanabe','yuki@kogatech.jp','+81 6 5555 0098','Koga Tech','website','contacted','Awaiting legal review',CURRENT_DATE + 8, now() - interval '7 days');
