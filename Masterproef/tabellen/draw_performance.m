function [] = draw_performance()

M = csvread('performantie.csv',1,1,[1,1,4,4]);
%swap jqm(1) en st(2) => st,jqm,lungo,kendo
M = M(:,[1:1-1,2,1+1:2-1,1,2+1:end]);
%swap jqm(2) en kendo(4) => st,kendo,lungo,jqm
M = M(:,[1:2-1,4,2+1:4-1,2,4+1:end]);
%swap lungo(3) en jqm(4)
M = M(:,[1:3-1,4,3+1:4-1,3,4+1:end]);

plot = bar(M');
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
title('Performantie raamwerken')
ylabel('tijd (s)') 
legend('POC','POC Cached','Loginscherm','Loginscherm Cached');
mylabels = {'Sencha Touch', 'Kendo UI', 'jQuery Mobile', 'Lungo'};
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', mylabels);
saveas(gca,'../figuren/performance.pdf');
system('pdfcrop ../figuren/performance.pdf ../figuren/performance.pdf');

figure;
title('Performantie van toestellen per raamwerk');
hold on;
apparaten = {'HTCDesireZ', 'GalaxyTab', 'GalaxyS', 'Nexus 7','iPad1 WiFi', 'iPad3 4G WiFi', 'iPhone 3GS', 'iPhone 4S'};

%jquery mobile performance
M = csvread('performantie/performantie-jqm.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
subplot(2,2,1);
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
title('jQuery Mobile')
ylabel('tijd (s)')
legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca);

%sencha touch performance
M = csvread('performantie/performantie-st.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
subplot(2,2,2);
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
title('Sencha Touch');
ylabel('tijd (s)');
legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca);

%kendo performance
M = csvread('performantie/performantie-kendo.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
subplot(2,2,3);
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
title('Kendo UI');
ylabel('tijd (s)');
legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca);

%lungo performance
M = csvread('performantie/performantie-lungo.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
subplot(2,2,4);
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
title('Lungo');
ylabel('tijd (s)');
legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca);
saveas(gca,'../figuren/performanceDevice.pdf');
system('pdfcrop ../figuren/performanceDevice.pdf ../figuren/performanceDevice.pdf');
