import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'zh' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    'tab.generator': '生成器 (Generator)',
    'tab.quickgrab': '快速抓取 (Quick Grab)',
    'tab.checker': '验证器 (Checker)',
    'label.threads': '线程数 (Threads)',
    'label.timeout': '超时 (Timeout s)',
    'label.retries': '重试 (Retries)',
    'label.s1timeout': '阶段1超时 (S1 Timeout)',
    'label.s1retries': '阶段1重试 (S1 Retries)',
    'label.sourceworkers': '源工人数 (Source Workers)',
    'label.fetchtimeout': '获取超时 (Fetch Timeout)',
    'label.backfillratio': '回填比例 (Backfill Ratio)',
    'label.geonodepages': 'Geonode 页数',
    'label.regions': '地区 (Regions)',
    'placeholder.regions': '例如: US, CN, JP (留空则为全球)',
    'label.regionlookup': '地区查询 (Region Lookup)',
    'btn.generate_validate': '生成并验证',
    'btn.generate_only': '仅生成',
    'btn.config_source': '配置抓取源',
    'btn.import_list': '导入代理列表',
    'btn.open_folder': '打开文件夹',
    'btn.clear': '清空',
    'btn.copy': '复制',
    'btn.stop': '停止',
    'status.validating': '正在验证 (Validating)...',
    'status.idle': '等待任务 (Idle)',
    'status.live': '在线',
    'status.offline': '离线',
    'status.running': '运行中...',
    'status.ready': '就绪',
    'log.waiting': '等待任务开始...',
    'log.start': '[*] 开始验证代理，线程数: 50 (阶段1=3s, 阶段2=10s, 流水线模式)...',
    'log.stop': '[!] 用户停止了任务',
    'log.validating': '验证代理中...',
    'msg.quickgrab_dev': '快速抓取模块正在开发中...',
    'msg.checker_dev': '高级验证器模块正在开发中...',
    'label.autoscroll': '自动滚动',
    'header.run_log': '运行日志 (Run Log)',
  },
  en: {
    'tab.generator': 'Generator',
    'tab.quickgrab': 'Quick Grab',
    'tab.checker': 'Checker',
    'label.threads': 'Threads',
    'label.timeout': 'Timeout (s)',
    'label.retries': 'Retries',
    'label.s1timeout': 'Stage 1 Timeout',
    'label.s1retries': 'Stage 1 Retries',
    'label.sourceworkers': 'Source Workers',
    'label.fetchtimeout': 'Fetch Timeout',
    'label.backfillratio': 'Backfill Ratio',
    'label.geonodepages': 'Geonode Pages',
    'label.regions': 'Regions',
    'placeholder.regions': 'e.g., US, CN, JP (Empty for Global)',
    'label.regionlookup': 'Region Lookup',
    'btn.generate_validate': 'Generate & Validate',
    'btn.generate_only': 'Generate Only',
    'btn.config_source': 'Config Source',
    'btn.import_list': 'Import List',
    'btn.open_folder': 'Open Folder',
    'btn.clear': 'Clear',
    'btn.copy': 'Copy',
    'btn.stop': 'Stop',
    'status.validating': 'Validating...',
    'status.idle': 'Idle',
    'status.live': 'Live',
    'status.offline': 'Offline',
    'status.running': 'Running...',
    'status.ready': 'Ready',
    'log.waiting': 'Waiting for task to start...',
    'log.start': '[*] Starting proxy validation, threads: 50 (S1=3s, S2=10s, Pipelined)...',
    'log.stop': '[!] User stopped the task',
    'log.validating': 'Validating proxies...',
    'msg.quickgrab_dev': 'Quick Grab module is under development...',
    'msg.checker_dev': 'Advanced Checker module is under development...',
    'label.autoscroll': 'Auto-scroll',
    'header.run_log': 'Run Log',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
