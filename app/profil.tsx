@@ .. @@
-import React, { useState, useEffect } from 'react';
+import React, { useState, useEffect, useRef } from 'react';
 import {
   View,
   Text,
@@ .. @@
 export default function ProfilScreen() {
   const { user, logout, updateProfile } = useAuth();
+  const scrollViewRef = useRef(null);
   const [isEditing, setIsEditing] = useState(false);
   const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
   const [formData, setFormData] = useState({
@@ .. @@
   };
 
   return (
-    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
+    <ScrollView 
+      ref={scrollViewRef}
+      style={styles.container} 
+      showsVerticalScrollIndicator={false}
+      keyboardShouldPersistTaps="handled"
+      onContentSizeChange={() => {
+        // Conserver la position de défilement actuelle
+        const scrollPosition = scrollViewRef.current?.scrollTop;
+        setTimeout(() => {
+          if (scrollViewRef.current && scrollPosition) {
+            scrollViewRef.current.scrollTop = scrollPosition;
+          }
+        }, 0);
+      }}
+    >
       {/* Header */}
       <LinearGradient
         colors={[Colors.agpBlue, Colors.agpGreen]}