"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScriptContextType {
  generatedScript: string;
  setGeneratedScript: (script: string) => void;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [generatedScript, setGeneratedScript] = useState("");

  return (
    <ScriptContext.Provider value={{ generatedScript, setGeneratedScript }}>
      {children}
    </ScriptContext.Provider>
  );
}

export function useScript() {
  const context = useContext(ScriptContext);
  if (context === undefined) {
    throw new Error('useScript must be used within a ScriptProvider');
  }
  return context;
}