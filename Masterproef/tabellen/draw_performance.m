function [] = draw_performance()

M = csvread('performantie.csv',1,1,[1,1,4,4]);
%swap jqm(1) en st(2) => st,jqm,lungo,kendo
M = M(:,[1:1-1,2,1+1:2-1,1,2+1:end]);
%swap jqm(2) en kendo(4) => st,kendo,lungo,jqm
M = M(:,[1:2-1,4,2+1:4-1,2,4+1:end]);
%swap lungo(3) en jqm(4)
M = M(:,[1:3-1,4,3+1:4-1,3,4+1:end]);

M = M';

plot = bar(M');
set(plot(1),'facecolor',[1 64/255 38/255]);
set(plot(2),'facecolor',[85/255 156/255 57/255]);
set(plot(3),'facecolor',[0 71/255 129/255]);
set(plot(4),'facecolor',[1 209/255 81/255]);
ylabel('tijd (s)') 
legend('Sencha Touch', 'Kendo UI', 'jQuery Mobile', 'Lungo');
mylabels = {'POC','POC uit cache','Login','Login uit cache'};
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', mylabels);
for i=1:4
    X = get( get(plot(i),'Children'), 'XData');
    Y = get( get(plot(i),'Children'), 'YData');
    for j = 1:size(X,2)
        text(X(3,j)/2+X(2,j)/2,Y(3,j)+.1,num2str(M(i,j),'%0.2f'),'Rotation',90);
    end
end
set(gca,'YLim',[0 max(M(:)+2)]);
saveas(gca,'../figuren/performance.pdf');
system('pdfcrop ../figuren/performance.pdf ../figuren/performance.pdf');

apparaten = {'HTCDesireZ', 'GalaxyTab', 'GalaxyS', 'Nexus 7','iPad1 WiFi', 'iPad3 4G WiFi', 'iPhone 3GS', 'iPhone 4S'};


%jquery mobile performance
M = csvread('performantie/performantie-jqm.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
figure;
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
%applyhatch(gcf,'\/-|');
ylabel('tijd (s)')
%legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
saveas(gca,'../figuren/performance-jquery.pdf');
system('pdfcrop ../figuren/performance-jquery.pdf ../figuren/performance-jquery.pdf');

%sencha touch performance
M = csvread('performantie/performantie-st.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
figure;
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
ylabel('tijd (s)');
%legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
saveas(gca,'../figuren/performance-st.pdf');
system('pdfcrop ../figuren/performance-st.pdf ../figuren/performance-st.pdf');

%kendo performance
M = csvread('performantie/performantie-kendo.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
figure;
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
ylabel('tijd (s)');
%legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
saveas(gca,'../figuren/performance-kendo.pdf');
system('pdfcrop ../figuren/performance-kendo.pdf ../figuren/performance-kendo.pdf');

%lungo performance
M = csvread('performantie/performantie-lungo.csv',1,2,[1,2,8,5]);
%omzetten naar seconden
M(:,2) = M(:,2)/1000;
M(:,4) = M(:,4)/1000;
figure;
plot = bar(M);
set(plot(1),'facecolor','black');
set(plot(2),'facecolor','red');
set(plot(3),'facecolor','green');
set(plot(4),'facecolor','blue');
ylabel('tijd (s)');
%legend('POC','POC Cached','Loginscherm','Loginscherm Cached')
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
saveas(gca,'../figuren/performance-lungo.pdf');
system('pdfcrop ../figuren/performance-lungo.pdf ../figuren/performance-lungo.pdf');
