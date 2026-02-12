"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Container, Card, CardContent } from "@/components/ui";
import { blogPosts } from "@/content/blog";

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-600)]">
          <Container>
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                Resources & Insights
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-montserrat)] text-white mb-6">
                Blog &{" "}
                <span className="text-[var(--secondary-300)]">News</span>
              </h1>
              <p className="text-xl text-white/80">
                Stay informed with the latest insights on test preparation, college
                admissions, and educational strategies.
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Blog Grid */}
        <section className="py-24 bg-white">
          <Container>
            {/* Featured Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <Link href={`/blog/${blogPosts[0].slug}`}>
                <Card className="overflow-hidden group" hover="lift">
                  <div className="grid md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center">
                      <span className="text-6xl font-bold text-white/20 font-[family-name:var(--font-montserrat)]">
                        FEATURED
                      </span>
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(blogPosts[0].date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {blogPosts[0].author}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-4 group-hover:text-[var(--primary-500)] transition-colors">
                        {blogPosts[0].title}
                      </h2>
                      <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                      <div className="flex items-center text-[var(--primary-500)] font-semibold">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </motion.div>

            {/* All Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.slice(1).map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full group" hover="lift">
                      <div className="aspect-video bg-gradient-to-br from-[var(--primary-400)] to-[var(--secondary-400)] flex items-center justify-center">
                        <span className="text-4xl font-bold text-white/20 font-[family-name:var(--font-montserrat)]">
                          {post.title.charAt(0)}
                        </span>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 mb-3 group-hover:text-[var(--primary-500)] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        {post.tags && (
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
