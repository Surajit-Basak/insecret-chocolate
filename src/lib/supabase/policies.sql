-- This policy allows any authenticated user whose role is 'admin' in the public.users table to select (read) all rows from the public.media table.
-- It is essential for the /admin/media page to display all uploaded media items.
DROP POLICY IF EXISTS "Allow admin read access to media" ON public.media;
CREATE POLICY "Allow admin read access to media"
ON "public"."media" FOR SELECT
TO authenticated
USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- This policy allows public (unauthenticated) viewers to see media files.
-- It is necessary for images to display correctly on public-facing pages like the shop and blog.
DROP POLICY IF EXISTS "Allow public read access to media" ON public.media;
CREATE POLICY "Allow public read access to media"
ON "public"."media" FOR SELECT
TO public
USING (true);

-- This policy allows public viewers to see the relationship between products and media.
-- It is necessary for product image galleries to function correctly.
DROP POLICY IF EXISTS "Allow public read access to product_images" ON public.product_images;
CREATE POLICY "Allow public read access to product_images"
ON "public"."product_images" FOR SELECT
TO public
USING (true);