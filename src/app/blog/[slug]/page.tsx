"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Tag, Share2 } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent, Button } from "@/components/ui";
import { blogPosts } from "@/content/blog";
import { CTA } from "@/components/sections";

export default function BlogPostPage() {
  const params = useParams();
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <>
        <Header />
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Get related posts
  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/blog"
                className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              <div className="flex items-center gap-4 text-sm text-white/70 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                {post.title}
              </h1>
              {post.tags && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </Container>
        </section>

        {/* Content */}
        <section className="py-16 bg-white">
          <Container size="md">
            <motion.article
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {post.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mt-8 mb-4"
                    >
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3
                      key={index}
                      className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mt-6 mb-3"
                    >
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
                  return (
                    <ul key={index} className="list-disc pl-6 space-y-2 mb-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-600">
                          {item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d\. /)) {
                  const items = paragraph.split("\n").filter((line) => line.match(/^\d\. /));
                  return (
                    <ol key={index} className="list-decimal pl-6 space-y-2 mb-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-600">
                          {item.replace(/^\d\. /, "")}
                        </li>
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-gray-600 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </motion.article>

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Share2 className="w-5 h-5" />
                  <span>Share this article</span>
                </div>
                <Link href="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    All Posts
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <Container>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                    <Card className="h-full group" hover="lift">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(relatedPost.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--primary-500)] transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        <CTA />
      </main>
      <Footer />
    </>
  );
}
