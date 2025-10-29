import { useState } from "react";
import { Header } from "@/components/layout/dynamic-header";
import { Footer } from "@/components/layout/dynamic-footer";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { ContactSection } from "@/components/home/contact-section";
import { VisitorChat } from "@/components/chat/visitor-chat";
import { ShoppingCart } from "@/components/cart/shopping-cart";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      
      {/* Shopping Cart */}
      <ShoppingCart />
      
      {/* Mostrar o chat apenas para visitantes (não autenticados) ou usuários regulares (não admins) */}
      {(!user || (user && user.role !== "admin")) && (
        <VisitorChat />
      )}
    </>
  );
}
