"use client";

import React from "react";
import { Folder, File, ChevronDown, Play, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Outline</h2>
        <Input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-800 text-white"
        />
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 flex items-center">
          <Folder className="mr-2" size={18} />
          Files
          <ChevronDown className="ml-auto" size={18} />
        </h2>
        <ul className="pl-4">
          <li className="flex items-center py-1">
            <Folder className="mr-2" size={14} />
            lib
          </li>
          <li className="flex items-center py-1">
            <Folder className="mr-2" size={14} />
            src
            <ul className="pl-4">
              <li className="flex items-center py-1">
                <Folder className="mr-2" size={14} />
                prefabs
              </li>
              <li className="flex items-center py-1">
                <Folder className="mr-2" size={14} />
                scenes
                <ul className="pl-4">
                  <li className="flex items-center py-1">
                    <File className="mr-2" size={14} />
                    Level.js
                  </li>
                  <li className="flex items-center py-1 text-orange-400">
                    <File className="mr-2" size={14} />
                    Level.scene
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

const MainEditor = () => {
  return (
    <div className="flex-1 bg-gray-800 p-4">
      <div className="bg-gray-700 h-full rounded-lg flex items-center justify-center text-white">
        <p>Main Editor Area</p>
      </div>
    </div>
  );
};

const Inspector = () => {
  return (
    <div className="w-80 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Inspector</h2>
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">File</h3>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-gray-400">Name</span>
          <span>Level.scene</span>
          <span className="text-gray-400">Full Name</span>
          <span className="truncate">
            starter-example-sunny-land/src/scenes/Level.scene
          </span>
          <span className="text-gray-400">Size</span>
          <span>23.2 KB</span>
        </div>
        <Button className="w-full mt-2">Open File</Button>
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Asset Pack Entry</h3>
        <Textarea
          className="w-full bg-gray-800 text-white"
          rows={4}
          placeholder="Asset pack details..."
        />
      </div>
      <div>
        <h3 className="text-md font-semibold mb-2">Scene</h3>
        <Textarea
          className="w-full bg-gray-800 text-white"
          rows={4}
          placeholder="Scene details..."
        />
      </div>
    </div>
  );
};

export default function EditorUI() {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-2 flex items-center">
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" className="ml-2">
          <Play className="h-6 w-6" />
        </Button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainEditor />
        <Inspector />
      </div>
    </div>
  );
}
