import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const IdeaContext = createContext(null);

export function IdeaProvider({ children }) {
  const { user } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setIdeas([]);
      setSelectedIdeaId(null);
      setIdeasLoading(false);
      return;
    }

    const storageKey = `selectedIdeaId_${user.uid}`;
    const persistedId = localStorage.getItem(storageKey);
    if (persistedId) {
      setSelectedIdeaId(persistedId);
    }

    const q = query(collection(db, "ideas"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((ideaDoc) => ({
        id: ideaDoc.id,
        ...ideaDoc.data(),
      }));

      data.sort((a, b) => {
        const aDate = a.createdAt?.seconds || 0;
        const bDate = b.createdAt?.seconds || 0;
        return bDate - aDate;
      });

      setIdeas(data);
      setIdeasLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    const storageKey = `selectedIdeaId_${user.uid}`;
    if (selectedIdeaId) {
      localStorage.setItem(storageKey, selectedIdeaId);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [selectedIdeaId, user?.uid]);

  useEffect(() => {
    if (!ideas.length) {
      setSelectedIdeaId(null);
      return;
    }

    if (!selectedIdeaId || !ideas.some((idea) => idea.id === selectedIdeaId)) {
      setSelectedIdeaId(ideas[0].id);
    }
  }, [ideas, selectedIdeaId]);

  const selectedIdea = useMemo(
    () => ideas.find((idea) => idea.id === selectedIdeaId) || null,
    [ideas, selectedIdeaId]
  );

  const value = useMemo(
    () => ({
      ideas,
      ideasLoading,
      selectedIdea,
      selectedIdeaId,
      setSelectedIdeaId,
    }),
    [ideas, ideasLoading, selectedIdea, selectedIdeaId]
  );

  return <IdeaContext.Provider value={value}>{children}</IdeaContext.Provider>;
}

export function useIdeas() {
  const context = useContext(IdeaContext);
  if (!context) {
    throw new Error("useIdeas must be used within IdeaProvider");
  }
  return context;
}
