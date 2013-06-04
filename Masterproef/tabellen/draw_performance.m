function [] = draw_performance()

%%% boxplots login + login uit cache

login = csvread('performantie-login.csv',1,0);
logincache = login(:,5:8);
login = login(:,1:4);

mylabels = {'Sencha Touch','Kendo UI','jQuery Mobile','Lungo'};
boxplot(login,'colors',[1 64/255 38/255;85/255 156/255 57/255;0 71/255 129/255;1 209/255 81/255],'labels',mylabels);
ylabel('tijd (s)') 
saveas(gca,'../figuren/performantie-login-nl.pdf');
system('pdfcrop ../figuren/performantie-login-nl.pdf ../figuren/performantie-login-nl.pdf');
figure;
boxplot(logincache,'colors',[1 64/255 38/255;85/255 156/255 57/255;0 71/255 129/255;1 209/255 81/255],'labels',mylabels);
ylabel('tijd (s)') 
saveas(gca,'../figuren/performantie-login-cache-nl.pdf');
system('pdfcrop ../figuren/performantie-login-cache-nl.pdf ../figuren/performantie-login-cache-nl.pdf');

%ENGLISH boxplots

boxplot(login,'colors',[1 64/255 38/255;85/255 156/255 57/255;0 71/255 129/255;1 209/255 81/255],'labels',mylabels);
ylabel('time (s)') 
saveas(gca,'../figuren/performantie-login-en.pdf');
system('pdfcrop ../figuren/performantie-login-en.pdf ../figuren/performantie-login-en.pdf');
figure;
boxplot(logincache,'colors',[1 64/255 38/255;85/255 156/255 57/255;0 71/255 129/255;1 209/255 81/255],'labels',mylabels);
ylabel('time (s)') 
saveas(gca,'../figuren/performantie-login-cache-en.pdf');
system('pdfcrop ../figuren/performantie-login-cache-en.pdf ../figuren/performantie-login-cache-en.pdf');

M = csvread('performantie-poc-vs-login.csv',1,1,[1 1 4 4]);
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
saveas(gca,'../figuren/performance-nl.pdf');
system('pdfcrop ../figuren/performance-nl.pdf ../figuren/performance-nl.pdf');
%%%%%%%%%%%% engelse performance voor paper
figure;
plot = bar(M');
set(plot(1),'facecolor',[1 64/255 38/255]);
set(plot(2),'facecolor',[85/255 156/255 57/255]);
set(plot(3),'facecolor',[0 71/255 129/255]);
set(plot(4),'facecolor',[1 209/255 81/255]);
ylabel('time (s)') 
legend('Sencha Touch', 'Kendo UI', 'jQuery Mobile', 'Lungo');
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', mylabels);
for i=1:4
    X = get( get(plot(i),'Children'), 'XData');
    Y = get( get(plot(i),'Children'), 'YData');
    for j = 1:size(X,2)
        text(X(3,j)/2+X(2,j)/2,Y(3,j)+.1,num2str(M(i,j),'%0.2f'),'Rotation',90);
    end
end
mylabels = {'POC','POC from cache','Login','Login from cache'};
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', mylabels);
set(gca,'YLim',[0 max(M(:)+2)]);
saveas(gca,'../figuren/performance-en.pdf');
system('pdfcrop ../figuren/performance-en.pdf ../figuren/performance-en.pdf');

apparaten = {'HTCDesireZ', 'GalaxyTab', 'GalaxyS', 'Nexus 7','iPad1 WiFi', 'iPad3 4G WiFi', 'iPhone 3GS', 'iPhone 4S'};
mylegend = {'POC','POC uit cache','Loginapplicatie','Loginapplicatie uit cache'};

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
ylabel('tijd (s)');
set(gcf, 'PaperPositionMode', 'auto');
legendflex([plot], mylegend, 'ref', gcf, 'anchor', {'n','n'}, 'buffer',[0 0], 'nrow',1, 'fontsize',8);
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
for i=1:4
    X = get( get(plot(i),'Children'), 'XData');
    Y = get( get(plot(i),'Children'), 'YData');
    for j = 1:size(X,2)
        text(X(3,j)/2+X(2,j)/2+.075,Y(3,j)+.1,num2str(M(j,i),'%0.2f'),'Rotation',90);
    end
end
set(gca,'YLim',[0 max(M(:)+2)]);
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
set(gcf, 'PaperPositionMode', 'auto');
legendflex([plot], mylegend, 'ref', gcf, 'anchor', {'n','n'}, 'buffer',[0 0], 'nrow',1, 'fontsize',8);
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
for i=1:4
    X = get( get(plot(i),'Children'), 'XData');
    Y = get( get(plot(i),'Children'), 'YData');
    for j = 1:size(X,2)
        text(X(3,j)/2+X(2,j)/2+.075,Y(3,j)+.1,num2str(M(j,i),'%0.2f'),'Rotation',90);
    end
end
set(gca,'YLim',[0 max(M(:)+4)]);
set(gcf, 'PaperPositionMode', 'auto');
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
set(gcf, 'PaperPositionMode', 'auto');
legendflex([plot], mylegend, 'ref', gcf, 'anchor', {'n','n'}, 'buffer',[0 0], 'nrow',1, 'fontsize',8);
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
for i=1:4
    X = get( get(plot(i),'Children'), 'XData');
    Y = get( get(plot(i),'Children'), 'YData');
    for j = 1:size(X,2)
        text(X(3,j)/2+X(2,j)/2+.075,Y(3,j)+.1,num2str(M(j,i),'%0.2f'),'Rotation',90);
    end
end
set(gca,'YLim',[0 max(M(:)+2)]);
set(gcf, 'PaperPositionMode', 'auto');
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
set(gcf, 'PaperPositionMode', 'auto');
legendflex([plot], mylegend, 'ref', gcf, 'anchor', {'n','n'}, 'buffer',[0 0], 'nrow',1, 'fontsize',8);
set(gca,'XTickLabelMode', 'manual', 'XTickLabel', apparaten);
rotateticklabel(gca,45);
for i=1:4
    X = get( get(plot(i),'Children'), 'XData');
    Y = get( get(plot(i),'Children'), 'YData');
    for j = 1:size(X,2)
        text(X(3,j)/2+X(2,j)/2+.075,Y(3,j)+.1,num2str(M(j,i),'%0.2f'),'Rotation',90);
    end
end
set(gca,'YLim',[0 max(M(:)+2)]);
set(gcf, 'PaperPositionMode', 'auto');
saveas(gca,'../figuren/performance-lungo.pdf');
system('pdfcrop ../figuren/performance-lungo.pdf ../figuren/performance-lungo.pdf');
close all;
