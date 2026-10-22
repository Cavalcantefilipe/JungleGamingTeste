import { OutOfScopeLink } from '@/features/layout/OutOfScopeLink';

import { BLOG } from '../content';

export function BlogSection() {
  return (
    <section aria-labelledby="blog-heading" className="mx-auto w-full max-w-[1200px] px-6 xl:px-0">
      <div className="mb-8 text-center">
        <h2 id="blog-heading" className="text-heading font-bold text-foreground">
          {BLOG.title}
        </h2>
        <p className="mt-2 text-body text-text-secondary">{BLOG.subtitle}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-10">
        {BLOG.posts.map((post) => (
          <article
            key={post.title}
            className="flex flex-col overflow-hidden rounded-card bg-surface-card"
          >
            <img
              src={post.image}
              alt=""
              width={300}
              height={200}
              loading="lazy"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="flex flex-col gap-2 p-4">
              <p className="text-caption-sm text-text-secondary">
                {post.date} | {post.readingTime}
              </p>
              <h3 className="text-body-lg font-bold text-foreground">{post.title}</h3>
              <p className="text-caption text-text-secondary">{post.excerpt}</p>
              <OutOfScopeLink className="text-caption font-bold text-text-accent hover:underline">
                Ler mais →
              </OutOfScopeLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
