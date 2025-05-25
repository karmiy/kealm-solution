import React, { useEffect, useState } from 'react';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import type { CLSMetric, FCPMetric, LCPMetric, TTFBMetric, INPMetric } from 'web-vitals';

interface Metric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  unit: string;
  description: string;
}

type WebVitalsMetric = CLSMetric | FCPMetric | LCPMetric | TTFBMetric | INPMetric;

const WebVitalsDemo: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const handleMetric = (metricName: string, description: string, unit: string = 'ms') => 
      (metric: WebVitalsMetric) => {
        setMetrics(prev => {
          const newMetrics = prev.filter(m => m.name !== metricName);
          return [...newMetrics, {
            name: metricName,
            value: metric.value,
            rating: metric.rating,
            unit,
            description
          }];
        });
        
        // 增强的控制台日志
        console.log(`🔍 ${metricName} 指标更新:`, {
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
          ...(metricName === 'LCP' && (metric as LCPMetric).entries.length > 0 && {
            lcpElement: (metric as LCPMetric).entries[(metric as LCPMetric).entries.length - 1].element,
            lcpElementInfo: {
              tagName: (metric as LCPMetric).entries[(metric as LCPMetric).entries.length - 1].element?.tagName,
              src: (metric as LCPMetric).entries[(metric as LCPMetric).entries.length - 1].element?.getAttribute?.('src'),
              size: (metric as LCPMetric).entries[(metric as LCPMetric).entries.length - 1].size
            }
          })
        });
      };

    // 配置选项：reportAllChanges 确保能获取到实时更新
    const reportOptions = { reportAllChanges: true };

    // 监听各种 Web Vitals 指标 (使用最新的 onXXX API)
    onCLS(handleMetric('CLS', '累积布局偏移 - 衡量页面加载过程中元素位置变化', ''), reportOptions);
    onFCP(handleMetric('FCP', '首次内容绘制 - 页面首次绘制任何内容的时间'));
    onLCP(handleMetric('LCP', '最大内容绘制 - 最大元素完成渲染的时间'), reportOptions);
    onTTFB(handleMetric('TTFB', '首字节时间 - 浏览器接收到服务器响应的第一个字节的时间'));
    onINP(handleMetric('INP', '交互到下次绘制 - 衡量页面对用户交互的响应性'), reportOptions);


  }, []);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return '#0CCE6B';
      case 'needs-improvement': return '#FFA400';
      case 'poor': return '#FF4E42';
      default: return '#666';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '') return value.toFixed(4); // CLS 是无单位的
    return `${Math.round(value)}${unit}`;
  };

  const [clickCount, setClickCount] = useState(0);
  const [layoutShift, setLayoutShift] = useState(false);

  // 模拟性能密集操作来影响 INP
  const handleHeavyClick = () => {
    setClickCount(c => c + 1);
    // 模拟一些计算密集的操作
    const start = performance.now();
    while (performance.now() - start < 50) {
      // 阻塞主线程 50ms
    }
  };

  // 触发布局偏移来影响 CLS
  const triggerLayoutShift = () => {
    setLayoutShift(!layoutShift);
  };

  // 刷新页面来重新测试 LCP
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', textAlign: 'center', margin: '10px 0' }}>Web Vitals 演示</h1>
      <p style={{ fontSize: '14px', textAlign: 'center', margin: '10px 0 20px 0' }}>这个页面演示了如何使用 Google 的 web-vitals 库来测量核心网页性能指标。</p>
      
      {/* LCP 测试用的大内容块 */}
      <div 
        id="lcp-test-content"
        style={{ 
          marginBottom: '30px',
          width: '100%',
          minHeight: '500px',
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '40px',
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          lineHeight: '1.6',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
        <h1 style={{ fontSize: '36px', margin: '0 0 20px 0', fontWeight: '900' }}>
          LCP 测试大内容区域
        </h1>
        <p style={{ fontSize: '20px', margin: '0 0 15px 0', opacity: 0.9 }}>
          这是一个专门设计的大内容块，用于测试 LCP (最大内容绘制) 指标
        </p>
        <p style={{ fontSize: '16px', margin: '0', opacity: 0.8 }}>
          这个区域占据了页面的大部分视觉空间，应该成为 LCP 的候选元素
        </p>
        <div style={{ 
          marginTop: '30px', 
          padding: '15px 30px', 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          borderRadius: '25px',
          fontSize: '14px'
        }}>
          💡 刷新页面来重新测试 LCP 指标
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>当前指标</h2>
        <div style={{ display: 'grid', gap: '10px' }}>
          {metrics.map((metric) => (
            <div 
              key={metric.name}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: getRatingColor(metric.rating) }}>
                  {metric.name}
                </h3>
                <span style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  color: getRatingColor(metric.rating)
                }}>
                  {formatValue(metric.value, metric.unit)}
                </span>
              </div>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                {metric.description}
              </p>
              <div style={{ 
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: getRatingColor(metric.rating),
                color: 'white',
                marginTop: '5px'
              }}>
                {metric.rating}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>性能测试操作</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={refreshPage}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🔄 刷新页面 (重新测试 LCP)
          </button>
          
          <button 
            onClick={handleHeavyClick}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ⚡ 点击测试 (影响 INP) - 已点击 {clickCount} 次
          </button>

          <button 
            onClick={triggerLayoutShift}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📐 触发布局偏移 (影响 CLS)
          </button>
        </div>
      </div>

      {/* 布局偏移测试元素 */}
      {layoutShift && (
        <div style={{
          width: '100%',
          height: '100px',
          backgroundColor: '#ffebee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#c62828',
          border: '2px solid #f44336',
          borderRadius: '8px',
          marginTop: '20px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          ⚠️ 这个元素的突然出现会导致布局偏移 (CLS)
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>💡 使用提示：</h3>
        <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px', fontSize: '14px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>🎯 正确的测试方法：</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>LCP 测试</strong>: 点击"刷新页面"按钮重新加载页面，观察大内容区域的渲染时间</li>
            <li><strong>网络节流</strong>: 在 Chrome DevTools → Network 面板中设置"Slow 3G"来模拟慢网络</li>
            <li><strong>观察控制台</strong>: 打开开发者工具的 Console 面板查看详细的指标数据和 LCP 元素信息</li>
            <li><strong>INP 测试</strong>: 快速连续点击"点击测试"按钮，观察交互响应时间</li>
            <li><strong>CLS 测试</strong>: 点击"触发布局偏移"按钮，观察布局稳定性变化</li>
            <li><strong>切换标签页</strong>: 切换到其他标签页再回来，会触发最终指标报告</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px', fontSize: '14px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ 重要说明：</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
            <li><strong>LCP 原理</strong>: LCP 主要在页面加载期间测量，不是交互后的性能指标</li>
            <li><strong>LCP 元素选择</strong>: 浏览器会自动选择视口内最大的内容元素，通常是占据最大视觉面积的元素</li>
            <li><strong>内容优先级</strong>: 大的文本块、图片或其他视觉元素都可能成为 LCP 候选元素</li>
            <li><strong>动态内容</strong>: 用户交互后动态添加的内容通常不会触发新的 LCP 测量</li>
            <li><strong>测试建议</strong>: 使用刷新页面的方式来正确测试 LCP 性能，观察控制台中的 LCP 元素信息</li>
          </ul>
        </div>
        
        <h3>📊 指标评分标准：</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '10px', fontSize: '14px' }}>
          <div>
            <strong>FCP (First Contentful Paint)</strong><br/>
            🟢 良好: &lt;1.8s | 🟡 需改进: &lt;3.0s | 🔴 差: &gt;3.0s
          </div>
          <div>
            <strong>LCP (Largest Contentful Paint)</strong><br/>
            🟢 良好: &lt;2.5s | 🟡 需改进: &lt;4.0s | 🔴 差: &gt;4.0s
          </div>
          <div>
            <strong>CLS (Cumulative Layout Shift)</strong><br/>
            🟢 良好: &lt;0.1 | 🟡 需改进: &lt;0.25 | 🔴 差: &gt;0.25
          </div>
          <div>
            <strong>TTFB (Time to First Byte)</strong><br/>
            🟢 良好: &lt;800ms | 🟡 需改进: &lt;1800ms | 🔴 差: &gt;1800ms
          </div>
          <div>
            <strong>INP (Interaction to Next Paint)</strong><br/>
            🟢 良好: &lt;200ms | 🟡 需改进: &lt;500ms | 🔴 差: &gt;500ms
          </div>
        </div>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d1ecf1', borderRadius: '5px', fontSize: '14px' }}>
          <strong>📝 注意：</strong> FID (First Input Delay) 已被废弃，INP 是更好的交互性能指标。
        </div>
      </div>
    </div>
  );
};

export default WebVitalsDemo; 