import { Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import React, { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
const Home = React.lazy(() => import('@/pages/Home'))
const Resume = React.lazy(() => import('@/pages/Resume'))
const Projects = React.lazy(() => import('@/pages/Projects'))
const Blogs = React.lazy(() => import('@/pages/Blogs'))
const Contacts = React.lazy(() => import('@/pages/Contacts'))
const Chats = React.lazy(() => import('@/pages/Chats'))
const InstagramFeed = React.lazy(() => import('@/pages/InstagramFeed'))
const Admin = React.lazy(() => import('@/pages/Admin'))
const Auth = React.lazy(() => import('@/pages/Auth'))
const Register = React.lazy(() => import('@/pages/Register'))

import ChatbotSidebar from '@/components/ChatbotSidebar';

function PublicLayout() {
  return (
    <>
      <Navigation />
      <div className="lg:ml-[240px] min-h-screen">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-12 pb-12">
          <Suspense fallback={<div className="p-4">Memuat...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/socials" element={<InstagramFeed />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Suspense>
        </main>
      </div>
      <ChatbotSidebar />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<React.Suspense fallback={<div>Memuat...</div>}><ProtectedRoute><Admin /></ProtectedRoute></React.Suspense>} />
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  );
}
