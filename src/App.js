import React, { useState, useCallback, useEffect } from "react";
import "devextreme/dist/css/dx.material.blue.light.css";
import "./App.css";

// Import DevExtreme Components
import TreeView from "devextreme-react/tree-view";
import List from "devextreme-react/list";
import {
  HtmlEditor,
  Toolbar as HtmlEditorToolbar,
  Item as HtmlEditorItem,
} from "devextreme-react/html-editor";
import ScrollView from "devextreme-react/scroll-view";
import Toolbar, { Item as ToolbarItem } from "devextreme-react/toolbar";
import Button from "devextreme-react/button";
import TextArea from "devextreme-react/text-area";
import Splitter, { Item as SplitterItem } from "devextreme-react/splitter";
import Tabs from "devextreme-react/tabs";

// MOCK DATA
const mainTabsData = [
  { id: 1, text: "Projects" },
  { id: 2, text: "Database Developers" },
  { id: 3, text: "Admin" },
];


const projectNotesData = [
  {
    id: "1",
    text: "CREAGIX",
    expanded: true,
    items: [
      {
        id: "1_1",
        text: "Requirements Management",
        pages: [
          {
            id: "p1",
            title: "Ideas",
            content:
              "<h2>Initial Ideas</h2><p>Content for the <strong>Ideas</strong> page.</p>",
          },
          {
            id: "p2",
            title: "Scope Definition",
            content: "<h2>Project Scope</h2><p>Defining goals.</p>",
          },
        ],
      },
      {
        id: "1_2",
        text: "UI/UX Design",
        pages: [
          {
            id: "p3",
            title: "Wireframes",
            content: "<h2>Wireframes Content</h2>",
          },
        ],
      },
    ],
  },
];
const initialEditorContent = `<h1>Welcome!</h1><p>Select a note to get started.</p>`;



// PANEL COMPONENTS
function CollapsedPanel({ text, onClick }) {
  return (
    <div className="collapsed-panel" onClick={onClick}>
      <span>{text}</span>
    </div>
  );
}
function PropertiesPanel({ onPinClick, onClose }) {
  return (
    <div className="panel properties-panel">
      <div className="panel-header">
        <span>Properties</span>
        <div className="panel-buttons">
          <button onClick={onPinClick} className="panel-icon-btn">
            📌
          </button>
          <button onClick={onClose} className="panel-icon-btn">
            ×
          </button>
        </div>
      </div>
      <div className="panel-content">
        <p>Property details will appear here.</p>
      </div>
    </div>
  );
}
function AiAssistPanel({ onPinClick, onClose }) {
  const [text, setText] = useState("");
  return (
    <div className="panel">
      <div className="panel-header">
        <span>AI Assist</span>
        <div className="panel-buttons">
          <button onClick={onPinClick} className="panel-icon-btn">
            📌
          </button>
          <button onClick={onClose} className="panel-icon-btn">
            ×
          </button>
        </div>
      </div>
      <div className="ai-panel-content">
        <ScrollView className="ai-chat-area">
          <div className="chat-message">
            <div className="chat-author">CREAGIX</div>
            <div className="chat-text">How can I help you?</div>
            <div className="chat-timestamp">Sent on: 04 Aug, 2025 05:28 PM</div>
          </div>
        </ScrollView>
        <div className="ai-input-area">
          <TextArea
            value={text}
            onValueChanged={(e) => setText(e.value)}
            height={80}
            placeholder="Type your message..."
          />
          <div className="ai-button-group">
            <Button text="Send" type="default" stylingMode="contained" />
            <Button text="Clear" onClick={() => setText("")} />
          </div>
        </div>
      </div>
    </div>
  );
}

// MAIN APP COMPONENT
function App() {
  const [isPropertiesOpen, setPropertiesOpen] = useState(true);
  const [isPropertiesPinned, setPropertiesPinned] = useState(false);
  const [isAiAssistOpen, setAiAssistOpen] = useState(true);
  const [isAiAssistPinned, setAiAssistPinned] = useState(false);
  const [projectPages, setProjectPages] = useState([]);
  const [editorContent, setEditorContent] = useState(initialEditorContent);
  const [selectedPageTitle, setSelectedPageTitle] = useState("Editor");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const projectsToolbarData = [
    { location: 'before', widget: 'dxButton', options: { icon: 'folder', text: 'Projects' }, cssClass: 'ribbon-style-button' },
    { location: 'before', widget: 'dxButton', options: { icon: 'doc', text: 'Biz Req Doc' }, cssClass: 'ribbon-style-button' },
    { location: 'before', widget: 'dxButton', options: { icon: 'edit', text: 'Notes' }, cssClass: 'ribbon-style-button' },
    { location: 'before', html: '<div class="toolbar-separator"></div>' },
    { location: 'after', widget: 'dxButton', options: { text: 'Properties', icon: 'columnfield', onClick: () => setPropertiesOpen(true) } },
    { location: 'after', widget: 'dxButton', options: { text: 'AI Assist', icon: 'comment', onClick: () => setAiAssistOpen(true) } }
  ];

  const dbToolbarData = [
    { location: 'before', widget: 'dxButton', options: { icon: 'runner', text: 'Run Query' }, cssClass: 'ribbon-style-button' },
  ];
  
  const adminToolbarData = [
      { location: 'before', widget: 'dxButton', options: { icon: 'user', text: 'Manage Users' }, cssClass: 'ribbon-style-button' },
  ];

  const toolbars = [projectsToolbarData, dbToolbarData, adminToolbarData];

  useEffect(() => {
    const timer = setTimeout(
      () => window.dispatchEvent(new Event("resize")),
      150
    );
    return () => clearTimeout(timer);
  }, [isPropertiesOpen, isPropertiesPinned, isAiAssistOpen, isAiAssistPinned]);

  const onProjectNoteSelect = useCallback((e) => {
    const selectedItem = e.itemData;
    if (selectedItem?.pages?.length) {
      setProjectPages(selectedItem.pages);
      setEditorContent(selectedItem.pages[0].content);
      setSelectedPageTitle(selectedItem.pages[0].title);
    } else {
      setProjectPages([]);
      setEditorContent(""); // Clear editor if no pages
      setSelectedPageTitle("Editor");
    }
  }, []);

  const onProjectPageSelect = useCallback((e) => {
    const selectedPage = e.itemData;
    if (selectedPage?.content) {
      setEditorContent(selectedPage.content);
      setSelectedPageTitle(selectedPage.title);
    }
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="welcome-message">Welcome, Thirukumaran Haridass</div>
      </header>
      {/* <Toolbar>
        <ToolbarItem
          location="before"
          widget="dxButton"
          options={{ icon: "folder", text: "PROJECTS", stylingMode: "text" }}
        />
        <ToolbarItem
          location="before"
          widget="dxButton"
          options={{ icon: "doc", text: "BIZ REQ DOC", stylingMode: "text" }}
        />
        <ToolbarItem
          location="before"
          widget="dxButton"
          options={{ icon: "edit", text: "NOTES", stylingMode: "text" }}
        />
        <ToolbarItem
          location="after"
          widget="dxButton"
          options={{
            icon: "columnfield",
            text: "Properties",
            onClick: () => setPropertiesOpen(true),
          }}
        />
        <ToolbarItem
          location="after"
          widget="dxButton"
          options={{
            icon: "comment",
            text: "AI Assist",
            onClick: () => setAiAssistOpen(true),
          }}
        />
      </Toolbar> */}
      <div className="ribbon-container">
        <Tabs
          dataSource={mainTabsData}
          selectedIndex={selectedTabIndex}
          onItemClick={(e) => setSelectedTabIndex(e.itemIndex)}
          width={"40%"}
        />
        <Toolbar dataSource={toolbars[selectedTabIndex]} />
      </div>
      <main className="app-main-content">
        {isPropertiesOpen && (
          <div className="side-panel-container properties-panel-container">
            {isPropertiesPinned ? (
              <CollapsedPanel
                text="Properties"
                onClick={() => setPropertiesPinned(false)}
              />
            ) : (
              <PropertiesPanel
                onPinClick={() => setPropertiesPinned(true)}
                onClose={() => setPropertiesOpen(false)}
              />
            )}
          </div>
        )}

        <div className="center-panel-wrapper">
          <Splitter orientation="horizontal" height="100%" width="100%">
            <SplitterItem size="25%" minSize="200px">
              <div className="center-pane">
                <div className="pane-header">Project Notes</div>
                <TreeView
                  dataSource={projectNotesData}
                  onItemClick={onProjectNoteSelect}
                  displayExpr="text"
                  keyExpr="id"
                  searchEnabled={true}
                />
              </div>
            </SplitterItem>
            <SplitterItem size="25%" minSize="200px">
              <div className="center-pane">
                <div className="pane-header">Project Pages</div>
                <List
                  dataSource={projectPages}
                  onItemClick={onProjectPageSelect}
                  displayExpr="title"
                  keyExpr="id"
                  noDataText="Select a note"
                  height="calc(100% - 30px)"
                />
              </div>
            </SplitterItem>
            <SplitterItem minSize="300px">
              <div className="center-pane">
                <div className="pane-header">{selectedPageTitle}</div>
                <HtmlEditor
                  value={editorContent}
                  height="calc(100% - 30px)"
                  onValueChanged={(e) => setEditorContent(e.value)}
                >
                 <HtmlEditorToolbar>
                    <HtmlEditorItem name="undo" />{" "}
                    <HtmlEditorItem name="redo" />
                    <HtmlEditorItem name="separator" />
                    <HtmlEditorItem name="bold" />{" "}
                    <HtmlEditorItem name="italic" />{" "}
                    <HtmlEditorItem name="underline" />
                    <HtmlEditorItem name="separator" />
                    <HtmlEditorItem name="insertTable" />
                  </HtmlEditorToolbar>
                </HtmlEditor>
              </div>
            </SplitterItem>
          </Splitter>
        </div>

        {isAiAssistOpen && (
          <div className="side-panel-container">
            {isAiAssistPinned ? (
              <CollapsedPanel
                text="AI Assistant"
                onClick={() => setAiAssistPinned(false)}
              />
            ) : (
              <AiAssistPanel
                onPinClick={() => setAiAssistPinned(true)}
                onClose={() => setAiAssistOpen(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
